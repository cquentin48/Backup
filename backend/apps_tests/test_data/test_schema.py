from django.test import SimpleTestCase

from data.models import ObjectModel
from data.schema import Query

class SchemaQueryTest(SimpleTestCase):
    """Schema test class from
    """

    databases = '__all__'

    def setUp(self):
        """Basic object model setup
        for later object tests
        """
        name = "Mon objet!"
        self.test_object = \
            ObjectModel.objects.create(name=name)
        self.query = Query()

    def tearDown(self) -> None:
        """After each test function
        which flush database
        """
        self.test_object.delete()

    def test_resolve_all_objects_should_return_created_object(self):
        """all_objects from class Query should return
        the created object
        """
        # Acts
        every_created_objects = self.query.resolve_all_objects("")

        # Asserts
        self.assertEqual(len(every_created_objects),1)
        self.assertEqual(every_created_objects[0].name,"Mon objet!")

    def test_resolve_objects_by_name_should_returns_object_only(self):
        """This test should returns the object only
        as the name is specified
        """
        # Given
        query_name = "Mon objet!"

        # Acts
        every_object_by_name = \
            self.query.resolve_objects_by_name("",name=query_name)

        # Asserts
        self.assertEqual(every_object_by_name.name,"Mon objet!")

    def test_resolve_objects_by_name_should_fails_here(self):
        """This test should returns nothing as no objects has
        the given name specified in test
        """
        # Given
        query_name = "kmkmk"

        # Acts
        every_object_by_name = \
            self.query.resolve_objects_by_name("",name=query_name)

        # Asserts
        self.assertEqual(every_object_by_name,None)
